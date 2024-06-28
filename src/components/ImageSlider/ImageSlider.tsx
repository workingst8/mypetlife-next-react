import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import SwiperCore from 'swiper';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import styles from './ImageSlider.module.scss';

const ImageSlider: React.FC = () => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchImages = async () => {
      const response = await fetch('/api/banner/initial');
      const images = await response.json();
      setImageUrls(images);
    };

    fetchImages();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null || e.target.files.length === 0) {
      console.log('No file selected.');
      return;
    }
    const file = e.target.files[0];
    const filename = encodeURIComponent(file.name);
    const res = await fetch(`/api/banner/upload?file=${filename}`);
    const data = await res.json();

    const formData = new FormData();
    Object.entries({ ...data.fields, file: file as Blob }).forEach(
      ([key, value]) => {
        formData.append(key, value as string | Blob);
      }
    );

    const uploadResult = await fetch(data.url, {
      method: 'POST',
      body: formData,
    });

    if (uploadResult.ok) {
      const newImageUrl = `${data.url}/${filename}`;
      const newImageList = [...imageUrls, newImageUrl];
      if (newImageList.length > 3) {
        newImageList.shift();
      }
      setImageUrls(newImageList);
    } else {
      console.log('Upload failed');
    }
  };
  SwiperCore.use([Autoplay]);
  return (
    <div>
      <Swiper
        loop={true}
        slidesPerView={1}
        className={styles.slideMain}
        autoplay={{ delay: 3000 }}
      >
        {imageUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <Image src={url} alt="Slide image" width={1280} height={853} />
          </SwiperSlide>
        ))}
      </Swiper>
      {session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      )}
    </div>
  );
};

export default ImageSlider;
