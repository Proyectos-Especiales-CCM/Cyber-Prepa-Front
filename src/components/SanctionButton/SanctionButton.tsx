interface SanctionButtonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  player: any;
}

const SanctionButton: React.FC<SanctionButtonProps> = ({ player }) => {
  return (
    <button type="button" 
      className="btn btn-primary" 
      data-bs-toggle="modal" 
      data-bs-target="#modalSanciones" 
      data-bs-matricula={`${player.id}`}>Sancionar
    </button>
  )
}

export default SanctionButton
