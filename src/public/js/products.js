document.addEventListener('DOMContentLoaded', () => {
    const handleError = (error) => {
        console.error('Error:', error);
        alert('Error al agregar el producto al carrito');
    };

    window.agregarAlCarrito = async (productId) => {

        if (!productId) {
            alert('ID del producto no válido');
            return;
        }

        try {
            const response = await fetch(`/cart/add/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity: 1 }) // Ajusta la cantidad si es necesario
            });

            if (response.ok) {
                const data = await response.json();
                alert('Producto agregado al carrito');
                // Opcional: Actualiza la interfaz de usuario o realiza otras acciones
            } else {
                const errorData = await response.json();
                alert(`Error al agregar el producto al carrito: ${errorData.error || 'Error desconocido'}`);
            }
        } catch (error) {
            handleError(error);
        }
    };
});

