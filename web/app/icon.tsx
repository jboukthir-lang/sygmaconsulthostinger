import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}

export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: '#001F3F',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#D4AF37',
          borderRadius: '8px',
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
        }}
      >
        S
      </div>
    ),
    {
      ...size,
    }
  )
}
