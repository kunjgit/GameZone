import "./Square.scss";
import { motion } from "framer-motion";

const Square = ({ ind, updateSquares, clsName }) => {
    const handleClick = () => {
        updateSquares(ind);
    };
    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="square"
            onClick={handleClick}
        >
            {clsName && (
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={clsName}
                ></motion.span>
            )}
        </motion.div>
    );
};

export default Square;