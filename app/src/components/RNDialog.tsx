import { RNModal, type RNModalProps } from './RNModal';

export interface RNDialogProps extends RNModalProps {}

/**
 * RNDialog
 * 
 * A wrapper around RNModal to serve as a designated Dialogue component.
 * Supports all RNModal props including size, title, footer, and overlay behavior.
 */
export function RNDialog(props: RNDialogProps) {
  return <RNModal {...props} />;
}
