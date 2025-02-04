import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
const isDesktop =
  typeof window !== 'undefined' &&
  window.matchMedia('(min-width: 768px)').matches;

const ComboModal = {
  Root: isDesktop ? Dialog : Drawer,
  Trigger: isDesktop ? DialogTrigger : DrawerTrigger,
  Content: isDesktop ? DialogContent : DrawerContent,
  Header: isDesktop ? DialogHeader : DrawerHeader,
  Title: isDesktop ? DialogTitle : DrawerTitle,
  Description: isDesktop ? DialogDescription : DrawerDescription,
  Footer: isDesktop ? DialogFooter : DrawerFooter,
  Close: isDesktop ? DialogClose : DrawerClose,
};

export const {
  Root,
  Trigger,
  Content,
  Header,
  Title,
  Description,
  Footer,
  Close,
} = ComboModal;

export default ComboModal;
