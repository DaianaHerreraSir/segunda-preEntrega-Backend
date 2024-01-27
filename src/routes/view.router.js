import { Router } from "express";
import productModel from "../models/products.models.js";

const viewRouter = Router();


viewRouter.get("/products", async (req, res) => {
    const { limit = 4, pageQuery = 1, query } = req.query;

    try {
        let queryOptions = {};

        if (query) {
           
            queryOptions = {
                ...queryOptions,
                //
                title: { $regex: new RegExp(query, 'i') }
            };
        }

        const {
            docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page
        } = await productModel.paginate(queryOptions, { limit, page: pageQuery, sort: { price: -1 }, lean: true });

        res.render("products", {
            status: "success",
            payload: {
                products: docs,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
                page
            }
        });
    } catch (error) {
        res.render("products", {
            status: "error",
            payload: {
                message: "Error al obtener la lista de productos."
            }
        });
    }
});

export default viewRouter;




