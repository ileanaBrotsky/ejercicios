import ToyService from "../service/toy.service.js";

const toyService = new ToyService()

export const getAll = (req, res) => {
    res.json(toyService.getAll())
}

export const getCheapest = (req, res) => {
    res.json(toyService.getCheapest())
}

export const create = (req, res) => {
    const data = req.body
    res.json(toyService.create(data))


}