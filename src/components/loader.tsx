interface LoaderProps {
    visible?: boolean;
}

export default function Loader({ visible = false }: LoaderProps) {
    if (!visible) return null;

    return (
        <div className="loader-mask">
            <div className="loader"></div>
        </div>
    );
}