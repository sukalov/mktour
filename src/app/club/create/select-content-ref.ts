export default function selectRef(ref: HTMLDivElement) {
  if (!ref) return;
  ref.ontouchstart = (e) => {
    const targetElement = e.target as HTMLElement;
    const isRemoveSelectionButton =
      targetElement.id === 'removeSelection' ||
      targetElement.closest('#removeSelection');

    if (!isRemoveSelectionButton) {
      e.preventDefault();
    }
  };
}
