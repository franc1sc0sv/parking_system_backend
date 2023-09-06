import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { PrismaClient } from "@prisma/client";
import { parqueos } from "./default_data/parqueos.js";

dotenv.config();

const prisma = new PrismaClient();

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  return res.status(200).json({ message: "Api is working" });
});

app.get("/parqueos", async (req, res) => {
  try {
    const parqueos = await prisma.parqueo.findMany();
    res.json({ data: parqueos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los parqueos" });
  }
});

app.listen(PORT, () => {
  console.log("Lisening at: " + PORT);
});

app.post("/reservas", async (req, res) => {
  try {
    const fechaInicial = new Date();
    const { fechaFinal, idParqueo } = req.body;
    const parqueo = await prisma.parqueo.findUnique({
      where: { id: idParqueo },
    });

    if (!parqueo) {
      return res.status(404).json({ error: "El parqueo no existe." });
    }
    const fechaFinalReservas = new Date(fechaFinal);

    const reserva = await prisma.reserva.create({
      data: {
        fechaInicial,
        fechaFinal: fechaFinalReservas,
        idParqueo,
        estado: "activo",
      },
    });

    res.status(201).json(reserva);
  } catch (error) {
    console.error("Error al crear la reserva:", error);
    res.status(500).json({ error: "Ocurrió un error al crear la reserva." });
  }
});

app.get("/reservas", async (req, res) => {
  try {
    const reservas = await prisma.reserva.findMany({
      orderBy: {
        estado: "asc",
      },
    });
    return res.status(200).json({ data: reservas });
  } catch (error) {
    console.error("Error al obtener las reservas:", error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al obtener las reservas." });
  }
});

app.put("/reservas/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const reserva = await prisma.reserva.findUnique({
      where: { id: parseInt(id) },
    });

    if (!reserva) {
      return res.status(404).json({ error: "La reserva no existe." });
    }

    const reservaFinalizada = await prisma.reserva.update({
      where: { id: parseInt(id) },
      data: { estado: "finalizado" },
    });

    res.status(200).json(reservaFinalizada);
  } catch (error) {
    console.error("Error al finalizar la reserva:", error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al finalizar la reserva." });
  }
});

(async function () {
  try {
    const isParqueos = await prisma.parqueo.findFirst();

    if (!isParqueos) {
      console.log("Parqueos creado");
      await prisma.parqueo.createMany({
        data: parqueos,
      });
    }
  } catch (error) {}
})();
