import { connect } from "mongoose";

export default async () => {
    console.log('Base de datos conectada');
    await connect('mongodb+srv://nicolasgemignani:GFzb1IGgC88ILOB9@codercluster.nyb7o.mongodb.net/BaseMongo?retryWrites=true&w=majority&appName=CoderCluster')
}