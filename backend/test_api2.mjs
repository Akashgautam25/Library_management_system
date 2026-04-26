import axios from 'axios';

async function test() {
    try {
        const res = await axios.post('http://localhost:5001/api/auth/login', {
            email: 'hihi@gmail.com',
            password: 'password123'
        });
        const token = res.data.data.token;
        console.log("Token length:", token.length);

        try {
            const allRes = await axios.get('http://localhost:5001/api/transactions/all?limit=200', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("ALL Success:", allRes.data.success);
        } catch (e) { console.log("ALL Error:", e.response?.data || e.message); }

        try {
            const overdueRes = await axios.get('http://localhost:5001/api/transactions/overdue', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("OVERDUE Success:", overdueRes.data.success);
        } catch (e) { console.log("OVERDUE Error:", e.response?.data || e.message); }

    } catch (err) {
        console.error("Login Error:", err.response?.data || err.message);
    }
}
test();
