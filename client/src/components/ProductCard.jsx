import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <Card className="group cursor-pointer transition-smooth hover:shadow-glow overflow-hidden">
      <div 
        className="relative h-48 bg-secondary overflow-hidden"
        onClick={() => navigate(`/product/${product.slug}`)}
      >
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
      </div>
      
      <CardContent className="p-4" onClick={() => navigate(`/product/${product.slug}`)}>
        <Badge variant="secondary" className="mb-2 text-xs">
          {product.origin}
        </Badge>
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{product.notes}</p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <span className="text-lg font-bold text-accent">
          ${(product.price_cents / 100).toFixed(2)}
        </span>
        <Button 
          size="sm"
          onClick={() => navigate(`/product/${product.slug}`)}
          className="transition-smooth"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
