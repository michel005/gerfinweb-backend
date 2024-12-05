import express from 'express'

export const PingRoute = () => {
    return express.Router().get('/ping', (req, res) => {
        res.status(200).send({
            status: 'OK',
            time: new Date(),
        })
    })
}
