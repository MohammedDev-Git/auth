
const SkeletonLoader = () => {
    const skeletonItems = Array.from({ length: 10 });

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            width: '100%',
        }}>
            {skeletonItems.map((_, index) => (
                <div key={index} style={
                    {
                        width: '100%',
                        height: '60px',
                        backgroundColor: '#e0e0e0',
                        borderRadius: '8px',
                        animation: 'pulse 1.5s infinite ease-in-out',
                    }
                } />
            ))}
        </div>
    );
};


export default SkeletonLoader;