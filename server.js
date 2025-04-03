const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 10000;

// Criar a pasta 'uploads' se não existir
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

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
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadDir));

// Armazena os apontamentos em memória (substituir por BD em produção)
let reports = [];

// Rota para upload de apontamento
app.post("/upload", upload.array("images", 3), (req, res) => {
  const { name, location, description } = req.body;
  const images = req.files ? req.files.map((file) => file.path) : [];

  if (!location || !description) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios." });
  }

  const newReport = { id: reports.length + 1, location, description, images };
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
