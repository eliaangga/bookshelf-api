const http = require('http');
const { nanoid } = require('nanoid');

const PORT = 9000;
const books = []; // Array untuk menyimpan data buku

const server = http.createServer((req, res) => {
    const { method, url } = req;

    if (method === 'POST' && url === '/books') {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const { name, year, author, summary, publisher, pageCount, readPage, reading } = JSON.parse(body);

            // Validasi: Pastikan properti "name" tidak kosong
            if (!name) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    status: 'fail',
                    message: 'Gagal menambahkan buku. Mohon isi nama buku',
                }));
                return;
            }

            // Validasi: readPage tidak boleh lebih besar dari pageCount
            if (readPage > pageCount) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    status: 'fail',
                    message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
                }));
                return;
            }

            // Membuat ID dan properti lainnya
            const id = nanoid(16);
            const insertedAt = new Date().toISOString();
            const updatedAt = insertedAt;
            const finished = pageCount === readPage;

            const newBook = {
                id, name, year, author, summary, publisher,
                pageCount, readPage, finished, reading,
                insertedAt, updatedAt,
            };

            books.push(newBook);

            // Berhasil menambahkan buku
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                    bookId: id,
                },
            }));
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'fail',
            message: 'Halaman tidak ditemukan',
        }));
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
