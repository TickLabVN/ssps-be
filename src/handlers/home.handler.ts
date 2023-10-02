import { envs } from '@configs';
import { HomeSlideResultDto } from '@dtos/out';
import { Handler } from '@interfaces';

const getHomeSlides: Handler<HomeSlideResultDto> = async () => {
    const slides = [
        {
            src: `${envs.MINIO_URL}/ssps/home/slbktv.jpg`,
            alt: 'slide1'
        },
        {
            src: `${envs.MINIO_URL}/ssps/home/slbk.jpg`,
            alt: 'slide2'
        },
        {
            src: `${envs.MINIO_URL}/ssps/home/dai-hoc-bach-khoa-tp-hcm-cong-bo-phuong-an-tuyen-sinh-2015jpg-1459820200.jpg`,
            alt: 'slide3'
        },
        {
            src: `${envs.MINIO_URL}/ssps/home/khuon-vien-dh-bach-khoa-tp-hcm-khien-dan-tinh-me-man-voi-nhung-hanh-cay-xanh-tham-toa-bong-mat-quanh-nam-14_20200608150159.jpg`,
            alt: 'slide4'
        }
    ];
    return slides;
};

export const homeHandler = {
    getHomeSlides: getHomeSlides
};
