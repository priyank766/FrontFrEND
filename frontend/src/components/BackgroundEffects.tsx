export const BackgroundEffects = () => {
  return (
    <>
      {/* Animated Mesh Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, hsl(280 100% 70% / 0.15) 0%, transparent 50%), 
              radial-gradient(circle at 80% 20%, hsl(180 100% 70% / 0.15) 0%, transparent 50%), 
              radial-gradient(circle at 40% 40%, hsl(320 100% 70% / 0.1) 0%, transparent 50%)
            `,
            animation: 'mesh-move 20s ease-in-out infinite'
          }}
        />
        
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-xl animate-float" />
        <div className="absolute top-3/4 right-1/4 w-48 h-48 rounded-full bg-gradient-to-r from-accent/20 to-primary/20 blur-xl animate-float" style={{animationDelay: '2s'}} />
        <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full bg-gradient-to-r from-primary-light/30 to-accent/30 blur-xl animate-float" style={{animationDelay: '4s'}} />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>
      
      {/* Vignette Effect */}
      <div className="fixed inset-0 -z-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/80" />
      </div>
    </>
  );
};