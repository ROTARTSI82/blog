import { initializeApp, applicationDefault } from 'firebase-admin/app';

import { getFirestore } from 'firebase-admin/firestore';

let app = initializeApp({
  credential: applicationDefault()
});

let db = getFirestore(app);

db.collection("pages/_granty29_blog_2025_06_20_/comments").get().then(docs => {
  docs.forEach(doc => {
    console.log(doc.data(), doc.id)
    db.collection("pages/_granty29_blog_2025_inner-outer-0620_/comments").doc(doc.id)
      .set(doc.data()).then(msg => {
      console.log(msg)
    });
  })
})

