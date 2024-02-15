import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";

// const todos = [
//   { id: 1, text: "buy Milk", completedAt: new Date() },
//   { id: 2, text: "buy bread", completedAt: null },
//   { id: 3, text: "buy butter", completedAt: new Date() },
// ];

export class TodosController {
  // *DI
  constructor() {}

  public getTodos = async (req: Request, res: Response) => {
    const todos = await prisma.todo.findMany({});

    return res.json(todos);
  };

  public getTodoById = async (req: Request, res: Response) => {
    const id = +req.params.id; //*  Signo "+" convierte un string => number
    if (isNaN(id))
      return res.status(400).json({ error: "ID argument is not a number" });

    const todo = await prisma.todo.findUnique({
      where: { id },
    });

    todo
      ? res.json(todo)
      : res.status(404).json({ error: `TODO with id ${id} not found` });
  };

  public createTodo = async (req: Request, res: Response) => {
    const [error, createTodoDto] = CreateTodoDto.create(req.body);

    if (error) return res.status(400).json({ error });

    const todo = await prisma.todo.create({
      data: createTodoDto!,
    });

    res.json(todo);
  };

  public updateTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;

    const [error, updateTodoDto] = UpdateTodoDto.update({
      ...req.body,
      id,
    });

    if (error) return res.status(400).json({ error });

    try {
      const todo = await prisma.todo.update({
        where: { id },
        data: updateTodoDto!.values,
      });

      res.json(todo);
    } catch (error) {
      return res.status(404).json({ error: `Todo with id ${id} not found` });
    }

    // todo.text = text || todo.text; //! Ojo referencia. Los obj en Js psan x referencia. Es una mala practica xq no se debe de mutar la informacion.
  };

  public deleteTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id))
      return res.status(400).json({ error: "ID argument is not a number" });

    try {
      const deleted = await prisma.todo.delete({
        where: { id },
      });

      res.json({
        ok: true,
        message: `Todo with id ${id} was deleted`,
        deleted,
      });
    } catch (error) {
      return res.status(404).json({ error: `Todo with id ${id} not found` });
    }

    // todos.splice(todos.indexOf(todo), 1);
  };
}
