import axios from 'axios';

async function test() {
    try {
        // 1. login as admin to get token
        const res = await axios.post('http://localhost:5001/api/auth/login', {
            email: 'kavya@gmail.com',
            password: 'password123'
        });
        const token = res.data.data.token;
        console.log("Logged in as admin");

        // 2. hit transactions active
        const activeRes = await axios.get('http://localhost:5001/api/transactions/active', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Active transactions success:", activeRes.data.success);
        console.log("Data length:", activeRes.data.data.data?.length);

        // 3. hit overdue
        const overdueRes = await axios.get('http://localhost:5001/api/transactions/overdue', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Overdue success:", overdueRes.data.success);

        // 4. hit all-history
        const historyRes = await axios.get('http://localhost:5001/api/transactions/all-history', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("History success:", historyRes.data.success);

    } catch (err) {
        console.error("Error:", err.response?.data || err.message);
    }
}
test();
