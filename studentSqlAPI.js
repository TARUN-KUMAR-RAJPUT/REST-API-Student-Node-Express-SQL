const express = require("express")
const app = express()
const router = express.Router()
const sql = require("mssql")
const cors = require("cors")

app.use(express.json())
app.use(cors())

const dbConfig = {
    server: 'xxxxx',
    user: 'xxx',
    password: 'xxxxxx',
    database: 'studentdb',
    options: {
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
}

sql.connect(dbConfig, (err) => {
    if (err) {
        throw err
    } else {
        console.log(`Connected to SQLServerDB Successfully`)
    }
})

router.get("/", (req, res) => {
    res.json("Student API using SQLServer Database")
})

router.get("/students", async (req, res) => {
    const request = new sql.Request()
    const selectQuery = "SELECT * FROM student"
    const data = await request.query(selectQuery)
    res.json(data.recordset)
    // request.query(selectQuery, (err, data) => {
    //     if(err){
    //         res.send(err).status(500)
    //     }
    //     res.json(data.recordset)
    // })
})

router.get("/students/:id", async (req, res) => {
    const studentId = req.params.id
    const request = new sql.Request()
    const selectQuery = `SELECT * FROM student WHERE _id = ${studentId}`
    const data = await request.query(selectQuery)
    res.json(data.recordset)
    // request.query(selectQuery, (err, data) => {
    //     if(err){
    //         res.send(err).status(500)
    //     }
    //     res.json(data.recordset)
    // })
})

router.post("/students", (req, res) => {
    const { name, email, city } = req.body
    const request = new sql.Request()
    const insertQuery = `INSERT INTO student(name, email, city) VALUES ('${name}', '${email}', '${city}')`
    request.query(insertQuery, (err, data) => {
        if (err) {
            res.send(err).status(500)
        }
        res.json(data)
    })
})

router.put("/students/:id", (req, res) => {
    const studentId = req.params.id
    const { name, email, city } = req.body
    const updateQuery = `UPDATE student SET name='${name}', email='${email}', city='${city}' WHERE _id = ${studentId}`
    const request = new sql.Request()
    request.query(updateQuery, (err, data) => {
        if(err){
            res.send(err).status(500)
        }
        res.json(data)
    })
})

router.delete("/students/:id", async (req, res) => {
    const studentId = req.params.id
    const deleteQuery = `DELETE FROM student where _id=${studentId}`
    const request = new sql.Request()
    try {
        const output = await request.query(deleteQuery)
        res.json(output)
    } catch(err){
        res.status(500).send(err)
    }
})

app.use("/api", router)

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server Listening at the PORT ${PORT}`)
})