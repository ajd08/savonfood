import {deleteAllItems} from "./_postgraphile";
import {createItems} from "./createItems";

const updateItems = async() => {
    await deleteAllItems();
    await createItems();
}

updateItems();

