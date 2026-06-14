import styles from './modal-overlay.module.css';

export const ModalOverlayUI = ({ onClick }: { onClick: () => void }) => (
  <div
    data-testid='modalOverlay'
    className={styles.overlay}
    onClick={onClick}
  />
);
