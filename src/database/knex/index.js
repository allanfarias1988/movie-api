import knex from "knex";
import knexSettings from "../../../knexfile.js";

const knexConnect = knex(knexSettings);

export default knexConnect;