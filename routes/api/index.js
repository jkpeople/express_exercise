const express = require("express");
const { readFile, writeFile } = require("fs");
const { join } = require("path");

const router = express.Router();
const pokeFile = join(__dirname, "../../public/pokemon.json");

router.get("/test", (req, res, next) => {
    try {
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
});

router.get("/pokemon", (req, res, next) => {
    // name
    // num/id
    const { name, num } = req.query;

    if (name || num) {
        try {
            // read file
            readFile(pokeFile, (err, contents) => {
                // parse the content
                let { pokemon } = JSON.parse(contents.toString())
                // find a match
                let foundPokemon = pokemon.find(
                    (p) => p.name.toLowerCase() == name.toLowerCase() || p.num == num
                );
                // send match(es) back to client
                res.json(foundPokemon); 
            });
        } catch (err) {
            next(err);
        }
    } else {
        try {
            res.sendFile(pokeFile);
        } catch (err) {
            next(err);
        }
    }
});

router.delete("/pokemon", (req, res, next) => {
    let updatedDetails = req.body;
    let { id } = req.query;

    if (isNaN(parseInt(id))) {
        res
            .status(400)
            .json({ msg: "Invalid request. You must provide a valid pokemon id."}); 
    }

    try {
        readFile(pokeFile, (err, contents) => {
            if (err) {
                next(err)
            }

            // parse the contents from pokeFile
            let { pokemon } = JSON.parse(contents.toString()); 
            let updatedPokemon = pokemon.map((p) => {
                // find the pokemon to update
                if (p.id == id) {
                    // update it
                    p = { ...p, ...updatedDetails }; 
                }

                return p
            })

            // overwrite the file 
            writeFile(
                pokeFile, 
                JSON.stringify({ pokemon: updatedPokemon }),
                (err) => {
                    if (err) {
                        next(err)
                    }

                    // send a response
                    res.json({ msg: `Successfully updated pokemon with id ${id}` });
                }
            );
        }); 
    } catch (err) {
        next(err);
    }
}); 

router.delete("/pokemon", (req, res, next) => {
    let { id } = req.query;

    if (isNaN(parseInt(id)))
        res
            res.status(400)
            .json({ msg: "Invalid request. You must provide a valid pokemon id." });

    try {
        readFile(pokeFile, (err, contents) => {
            // parse the contents
            let pokemon = JSON.parse(contents.toString()); 
            // find the pokemon to delete 
            let filteredPokemon = pokemon.filter((p) => p.id == id);
            // overwrite teh file 
            writeFile(
                pokeFile, 
                JSON.stringify({ pokemon: filteredPokemon }),
                (err) => {
                    if (err) {
                        next(err)
                    } else {
                        //send confirmation to client
                        res.json({ msg: `Successfully delted pokemon with id ${id}.` }); 
                    }
                }
            }); 
        }); 
    } catch (err) {
        next(err);                                                                          /*==ACTION HAPPENS IF GIVEN VALID INTEGER ID==*/ 
    }
});

module.exports = router; 