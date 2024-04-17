import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig';

const uploadImage = async (imageUri) => {
  const response = await fetch(imageUri);
  const blob = await response.blob();

  const storageRef = ref(storage, "Receipts/");
  const uploadTask = uploadBytesResumable(storageRef, blob);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.error("Upload failed:", error);
        reject(error); // Reject the promise on error
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          resolve(downloadURL); // Resolve the promise with the download URL
        });
      }
    );
  });
};

export default uploadImage;