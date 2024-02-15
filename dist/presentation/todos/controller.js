"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodosController = void 0;
const postgres_1 = require("../../data/postgres");
const dtos_1 = require("../../domain/dtos");
// const todos = [
//   { id: 1, text: "buy Milk", completedAt: new Date() },
//   { id: 2, text: "buy bread", completedAt: null },
//   { id: 3, text: "buy butter", completedAt: new Date() },
// ];
class TodosController {
    // *DI
    constructor() {
        this.getTodos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const todos = yield postgres_1.prisma.todo.findMany({});
            return res.json(todos);
        });
        this.getTodoById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = +req.params.id; //*  Signo "+" convierte un string => number
            if (isNaN(id))
                return res.status(400).json({ error: "ID argument is not a number" });
            const todo = yield postgres_1.prisma.todo.findUnique({
                where: { id },
            });
            todo
                ? res.json(todo)
                : res.status(404).json({ error: `TODO with id ${id} not found` });
        });
        this.createTodo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [error, createTodoDto] = dtos_1.CreateTodoDto.create(req.body);
            if (error)
                return res.status(400).json({ error });
            const todo = yield postgres_1.prisma.todo.create({
                data: createTodoDto,
            });
            res.json(todo);
        });
        this.updateTodo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = +req.params.id;
            const [error, updateTodoDto] = dtos_1.UpdateTodoDto.update(Object.assign(Object.assign({}, req.body), { id }));
            if (error)
                return res.status(400).json({ error });
            try {
                const todo = yield postgres_1.prisma.todo.update({
                    where: { id },
                    data: updateTodoDto.values,
                });
                res.json(todo);
            }
            catch (error) {
                return res.status(404).json({ error: `Todo with id ${id} not found` });
            }
            // todo.text = text || todo.text; //! Ojo referencia. Los obj en Js psan x referencia. Es una mala practica xq no se debe de mutar la informacion.
        });
        this.deleteTodo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = +req.params.id;
            if (isNaN(id))
                return res.status(400).json({ error: "ID argument is not a number" });
            try {
                const deleted = yield postgres_1.prisma.todo.delete({
                    where: { id },
                });
                res.json({
                    ok: true,
                    message: `Todo with id ${id} was deleted`,
                    deleted,
                });
            }
            catch (error) {
                return res.status(404).json({ error: `Todo with id ${id} not found` });
            }
            // todos.splice(todos.indexOf(todo), 1);
        });
    }
}
exports.TodosController = TodosController;
