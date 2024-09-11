export default function Box({ color }) {
    return (
      <div
        style={{
          width: 20,
          height: 20,
          display: 'inline-block',
          backgroundColor: color,
          border: '1px solid #ccc',
        }}
      />
    );
  }
  