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

// Fungsi untuk mendapatkan daftar artikel
async function getArticle(req, res) {
  try {
    const articlesSnapshot = await db.collection('Article').get();
    if (articlesSnapshot.empty) {
      res.status(404).send({ message: 'No articles found' });
      return;
    }

    const articlesList = articlesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(articlesList);
  } catch (error) {
    console.error('Error getting articles:', error);
    res.status(500).send({ error: 'Error getting articles' });
  }
}

module.exports = { addArticle, getArticle };
