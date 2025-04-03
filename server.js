const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const port = 5000;

// Configuração do armazenamento de imagens
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage, limits: { files: 3 } });

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Armazena os apontamentos em memória (substituir por BD em produção)
let reports = [];

// Rota para upload de apontamento
app.post("/upload", upload.array("images", 3), (req, res) => {
  const { name, location, description } = req.body;
  const images = req.files.map((file) => file.path);

  if (!name || !location || !description) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios." });
  }

  const newReport = { id: reports.length + 1, name, location, description, images };
  reports.push(newReport);
  
  res.json({ message: "Apontamento recebido!", report: newReport });
});

// Rota para listar apontamentos
app.get("/reports", (req, res) => {
  res.json(reports);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
