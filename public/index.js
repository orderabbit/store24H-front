const mysql = require('mysql');
const schedule = require('node-schedule');

// MySQL 데이터베이스 연결 설정
const connection = mysql.createConnection({
    host: '127.0.0.1',       // 데이터베이스 서버 주소
    user: 'root',    // 데이터베이스 사용자 이름
    password: '',// 데이터베이스 비밀번호
    database: 'teamProject', // 데이터베이스 이름
    charset: 'UTF8_GENERAL_CI'
});

// 데이터베이스 연결
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database as id ' + connection.threadId);
});

// 일정 기간이 지난 결제 정보를 삭제하는 함수
const deleteOldPayments = () => {
    const query = "DELETE FROM payment WHERE payment_date < NOW() - INTERVAL 3 YEAR";

    connection.query(query, (error, results, fields) => {
        if (error) {
            console.error('Error deleting old payments:', error.stack);
            return;
        }
        console.log(`${results.affectedRows} rows deleted.`);
    });
};

// 매일 자정에 스크립트를 실행
schedule.scheduleJob('0 0 * * *', deleteOldPayments);
