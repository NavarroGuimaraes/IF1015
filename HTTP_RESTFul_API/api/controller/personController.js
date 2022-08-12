const objectUtils = require('../../utils/objectUtils');

const jsonfile = require('jsonfile')
const path = './personPets.json';
const file = __dirname + "/personPets.json"; // Sim, isso é meio que uma gambi rsrs. Depois corrijo
const NAME_PROPERTY = "name";
const PETS_PROPERTY = "pets";

module.exports = {

    listAll(req, res) {

        const personPets = require(path);
        return res.status(200).json(personPets);

    },

    listOne(req, res) {

        const personPets = require(path);
        const { personId } = req.params;

        let foundPerson = personPets[personId.toLowerCase()];
        if (foundPerson) {
            return res.status(200).json(foundPerson);
        }

        return res.status(404).json({
            message: "Person not Found"
        })

    },

    updatePerson(req, res) {
        const person = req.body;
        const { personId } = req.params;
        let missingFields = [];

        //Sim, eu sei, código duplicado. Depois coloco isso separado, tava sem tempo.

        if (objectUtils.doesNotHaveProperty(person, NAME_PROPERTY)) {
            missingFields.push(NAME_PROPERTY);
        }

        if (objectUtils.doesNotHaveProperty(person, PETS_PROPERTY)) {
            missingFields.push(PETS_PROPERTY)
        }

        if (missingFields.length != 0) {
            return res.status(422).json({
                message: `${missingFields.join(",")} are required fields`
            })
        }

        let personPets = require(path);
        
        let isError = false;

        let foundPerson = personPets[personId];
        if (foundPerson) {
            personPets[personId] = person;
            
            jsonfile.writeFileSync(file, personPets, (err) => {
                console.log(err);
                isError = true;
            })
    
            if (isError) {
                return res.status(500).json({
                    message: "Internal Server Error. Please Try again later"
                })
            }
    
            return res.status(200).json(personPets[personId]);
        }

        return res.status(404).json({
            message: "Person not found"
        })
        


    },

    createPerson(req, res) {

        const person = req.body;
        let missingFields = [];

        if (objectUtils.doesNotHaveProperty(person, NAME_PROPERTY)) {
            missingFields.push(NAME_PROPERTY);
        }

        if (objectUtils.doesNotHaveProperty(person, PETS_PROPERTY)) {
            missingFields.push(PETS_PROPERTY)
        }

        if (missingFields.length != 0) {
            return res.status(422).json({
                message: `${missingFields.join(",")} are required fields`
            })
        }
        let personPets = require(path);

        const name = person.name.toLowerCase();
        let id = name;
        let foundPerson = personPets[id];

        if (foundPerson) {
            let counter = 1;
            while (foundPerson) {
                id = name + counter;
                foundPerson = personPets[id];
                counter++;
            }
        }

        personPets[id] = person;

        let isError = false;

        jsonfile.writeFileSync(file, personPets, (err) => {
            console.log(err);
            isError = true;
        })

        if (isError) {
            return res.status(500).json({
                message: "Internal Server Error. Please Try again later"
            })
        }

        return res.status(201).json(personPets[id]);
    },

    deletePerson(req, res) {
        
        const {personId} = req.params;
        let personPets = require(path);
        let foundPerson = personPets[personId];
        if (foundPerson) {
            
            delete personPets[personId];
            
            jsonfile.writeFileSync(file, personPets, (err) => {
                console.log(err);
                isError = true;
            })

            return res.status(204).json({});
        }
        return res.status(404).json({
            message: "Person not found"
        })
    }
}