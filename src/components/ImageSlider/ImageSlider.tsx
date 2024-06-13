'use client'

import Image from 'next/image';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import styles from './ImageSlider.module.scss';

const ImageSlider: React.FC = () => {
  const initialImages = [
    '/images/home/home.png',
    '/images/home/home.png',
    '/images/home/home.png',
  ];

  const [imageUrls, setImageUrls] = useState(initialImages);

  return (
    <div>
      <Swiper loop={true} slidesPerView={1} className={styles.slideMain}>
        {imageUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <Image src={url} alt="Slide" width={1280} height={853} />
          </SwiperSlide>
        ))}
      </Swiper>
      <input
        type="file"
        accept="image/*"
        onChange={async (e) => {
          if (e.target.files === null || e.target.files.length === 0) {
            console.log('No file selected.');
            return;
          }
          let file = e.target.files[0]
          let filename = encodeURIComponent(file.name)
          let res = await fetch(`/api/banner?file=${filename}`)
          const data = await res.json();
          
          const formData = new FormData()
          Object.entries({ ...data.fields, file: file as Blob }).forEach(([key, value]) => {
            formData.append(key, value as string | Blob);
          })
          let uploadResult = await fetch(data.url, {
            method: 'POST',
            body: formData,
          })
          if (uploadResult.ok) {
            const newImageUrl = `${data.url}/${filename}`;
            const newImageList = [...imageUrls, newImageUrl];
            if (newImageList.length > 3) {
              newImageList.shift();
            }
            setImageUrls(newImageList);
          } else {
            console.log('Upload failed')
          }
        }}
      />
    </div>
  );
};

export default ImageSlider;
