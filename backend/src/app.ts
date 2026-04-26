Not provided in the given snippet, however, an example of how to prevent SQL injection in a route would be: 
const route = async (req, res) => {
    const userInput = req.params.userInput;
    const query = {
        text: 'SELECT * FROM table WHERE column = $1',
        values: [userInput]
    };
    try {
        const result = await Database.getInstance().query(query);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to query database' });
    }
};