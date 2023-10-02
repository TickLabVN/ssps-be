import { HomeSlideResultDto } from '@dtos/out';
import { Handler } from '@interfaces';

const getHomeSlides: Handler<HomeSlideResultDto> = async () => {
    const slides = [
        {
            src: 'https://e-learning.hcmut.edu.vn/theme/boost/images/slbktv.jpg?1695219022292',
            alt: 'slide1'
        },
        {
            src: 'https://e-learning.hcmut.edu.vn/theme/boost/images/slbk.jpg?1695219022805',
            alt: 'slide2'
        },
        {
            src: 'https://static.tuoitre.vn/tto/i/s626/2016/04/05/dai-hoc-bach-khoa-tp-hcm-cong-bo-phuong-an-tuyen-sinh-2015jpg-1459820200.jpg',
            alt: 'slide3'
        },
        {
            src: 'https://we25.vn/media2018/Img_News/2020/06/08/khuon-vien-dh-bach-khoa-tp-hcm-khien-dan-tinh-me-man-voi-nhung-hanh-cay-xanh-tham-toa-bong-mat-quanh-nam-14_20200608150159.jpg',
            alt: 'slide4'
        }
    ];
    return slides;
};

export const homeHandler = {
    getHomeSlides: getHomeSlides
};
