import multer from "multer"

export default function createMemoryStorage() {
  // Configura almacenamiento para multer
  const storage = multer.memoryStorage(); // Usar memoria en lugar de disco

  // Inicializa multer con el almacenamiento en memoria
  const upload = multer({ storage: storage });

  return upload;
}
