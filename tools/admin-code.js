// Doi ma quan tri: node tools/admin-code.js <ma-moi>   -> in ra dong ADMIN_HASH de dan vao admin.html
const h=require('crypto').createHash('sha256').update('efz-admin-v1'+process.argv[2]).digest('hex');
console.log("const ADMIN_HASH   = '"+h+"';");
