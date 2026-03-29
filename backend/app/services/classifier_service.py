import httpx
from app.models.entities import Species

class ClassifierService:
    HF_API_URL = "https://api-inference.huggingface.co/models/microsoft/resnet-50"
    
    async def classify_image(self, image_data: bytes, catalog: list[Species]) -> Species:
        """
        Classifies an image using the HuggingFace Inference API.
        If the model fails or has no match, falls back to the first catalog entry.
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.HF_API_URL, 
                    content=image_data,
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    predictions = response.json()
                    # Example: [{"label": "mosquito", "score": 0.9}, ...]
                    if predictions and isinstance(predictions, list):
                        top_label = predictions[0]["label"].lower()
                        
                        # Match label with species catalog
                        for species in catalog:
                            if species.scientific_name.lower() in top_label or species.common_name.lower() in top_label:
                                return species
                            
                            # Broad matching for demo (if label contains 'mosquito' -> Aedes)
                            if "mosquito" in top_label and "aedes" in species.scientific_name.lower():
                                return species
                            if "snail" in top_label and "achatina" in species.scientific_name.lower():
                                return species
                            if "nettle" in top_label and "urtica" in species.scientific_name.lower():
                                return species
        
        except Exception as e:
            print(f"Error en clasificacion AI: {str(e)}")
            
        # Fallback deterministic for demo.
        return catalog[0]

    @staticmethod
    def build_alert(species: Species) -> str:
        if species.direct_danger.lower() == "yes":
            return (
                "Alerta: la especie analizada representa peligro directo para "
                "la poblacion. Se recomienda evitar contacto y notificar a salud publica."
            )
        if species.risk_category.lower() == "invasora":
            return (
                "Advertencia: especie invasora detectada. Puede alterar el "
                "ecosistema local y desplazar especies nativas."
            )
        return "Riesgo moderado: se recomienda seguimiento y educacion preventiva."
