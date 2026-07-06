//Authentication middleware
const authenticate = (err, req, res, next)=>{
    try{
        const token = 'xyz';
        isAuthenticated = token === 'xyz';
        if (!isAuthenticated) {
            res.status(401).send("Unauthorized");
        } else {
            // req.user = decodeToken(token); // Assuming you have a function to decode the token and get user info
            next();
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
};

// Authorization middleware
const authorize = (roles) => (err, req, res, next) => {
    try{
        const userRole = 'admin'; // req.user.role; // Assuming you have a user object in the request
        if (!roles.includes(userRole)) {
            res.status(403).send("Forbidden");
        } else {
            next();
        }
    }catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { authenticate, authorize };