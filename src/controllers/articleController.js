const { db } = require('../firebase');

// Fungsi untuk menambahkan artikel baru
async function addArticle(req, res) {
  const { author, source, title, picture1, content1, picture2, content2, tag, dateCreated } = req.body;

  try {
    const newArticle = {
      author,
      source,
      title,
      picture1,
      content1,
      picture2,
      content2,
      tag,
      dateCreated: dateCreated || new Date().toISOString() // gunakan tanggal saat ini jika tidak ada
    };

    const articleRef = await db.collection('Article').add(newArticle);
    res.status(201).send({ id: articleRef.id, ...newArticle });
  } catch (error) {
    console.error('Error adding article:', error);
    res.status(500).send({ error: 'Error adding article' });
  }
}

module.exports = { addArticle };
