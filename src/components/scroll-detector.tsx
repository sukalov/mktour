import {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

const ScrollDetector: FC<
  PropsWithChildren & { setVisible: Dispatch<SetStateAction<boolean>> }
> = ({ setVisible, children }) => {
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
      );
      const bottom = windowHeight + window.scrollY >= documentHeight;
      let moving = window.scrollY;
      
      if (position > 10 && !bottom) setVisible(position > moving);
      setPosition(moving);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  return <div>{children}</div>;
};

export default ScrollDetector;
