import { Router } from "express";

const router = Router()

router.get('/', (req,res)=> {
    res.render('home', {lastName: 'Rivero', firstName: "Kevin"})
})

export default router