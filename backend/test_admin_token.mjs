async function test() {
    try {
        const res = await fetch('http://localhost:5001/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'hihi@gmail.com', password: 'password123' })
        });
        const data = await res.json();
        const token = data.data.token;
        console.log("Logged in:", data.success);

        const allRes = await fetch('http://localhost:5001/api/transactions/all?limit=200', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("ALL:", allRes.status, await allRes.text());

        const overdueRes = await fetch('http://localhost:5001/api/transactions/overdue', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("OVERDUE:", overdueRes.status, await overdueRes.text());

    } catch (err) {
        console.error("Error:", err.message);
    }
}
test();
