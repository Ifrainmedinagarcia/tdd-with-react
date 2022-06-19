import { rest } from "msw";

export const handlers = [
    rest.post('/login', (_req, res, ctx) => {
        sessionStorage.setItem('is-authenticated', true)
        return res(
            ctx.status(200)
        )
    })
]

export default {handlers}