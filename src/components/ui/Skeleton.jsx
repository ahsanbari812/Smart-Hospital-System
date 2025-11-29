const Skeleton = ({ className = "", variant = "default" }) => {
  const baseClasses = "animate-pulse bg-muted rounded";
  
  const variants = {
    default: "h-4 w-full",
    text: "h-4 w-3/4",
    title: "h-8 w-1/2",
    avatar: "h-12 w-12 rounded-full",
    card: "h-32 w-full",
    button: "h-10 w-24",
    circle: "rounded-full",
  };

  return (
    <div 
      className={`${baseClasses} ${variants[variant] || variants.default} ${className}`}
      style={{
        background: 'linear-gradient(90deg, hsl(var(--muted)) 0%, hsl(var(--muted) / 0.8) 50%, hsl(var(--muted)) 100%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite'
      }}
    />
  );
};

export default Skeleton;
