import tensorflow as tf
import cv2
import numpy as np

tf.flags.DEFINE_integer("width", 640, "Screen width")
tf.flags.DEFINE_integer("height", 480, "Screen height")
tf.flags.DEFINE_float("threshold", 0.6, "Threshold for score")
tf.flags.DEFINE_float("alpha", 0.2, "Transparent level")
tf.flags.DEFINE_string("pre_trained_model_path", "src/pretrained_model.pb", "Path to pre-trained model")

FLAGS = tf.flags.FLAGS


def main():
    graph, sess = load_graph(FLAGS.pre_trained_model_path)
    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, FLAGS.width)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, FLAGS.height)
    mp = _mp.get_context("spawn")
    v = mp.Value('i', 0)
    lock = mp.Lock()
    process = mp.Process(target=battle_city, args=(v, lock))
    process.start()
    x_center = int(FLAGS.width / 2)
    y_center = int(FLAGS.height / 2)
    radius = int(min(FLAGS.width, FLAGS.height) / 6)
    while True:
        key = cv2.waitKey(10)
        if key == ord("q"):
            break
        _, frame = cap.read()
        frame = cv2.flip(frame, 1)
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        boxes, scores, classes = detect_hands(frame, graph, sess)
        frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
        results = predict(boxes, scores, classes, FLAGS.threshold, FLAGS.width, FLAGS.height)
        if len(results) == 1:
            x_min, x_max, y_min, y_max, category = results[0]
            x = int((x_min + x_max) / 2)
            y = int((y_min + y_max) / 2)
            cv2.circle(frame, (x, y), 5, RED, -1)
            if category == "Closed" and np.linalg.norm((x - x_center, y - y_center)) <= radius:
                action = 0 # Stay
                text = "Stay"
            elif category == "Closed" and is_in_triangle((x, y), [(0, 0), (FLAGS.width, 0),
                                                                  (x_center, y_center)]):
                action = 1  # Up
                text = "Up"
            elif category == "Closed" and is_in_triangle((x, y), [(0, FLAGS.height),
                                                                  (FLAGS.width, FLAGS.height), (x_center, y_center)]):
                action = 2  # Down
                text = "Down"
            elif category == "Closed" and is_in_triangle((x, y), [(0, 0),
                                                                  (0, FLAGS.height),
                                                                  (x_center, y_center)]):
                action = 3  # Left
                text = "Left"
            elif category == "Closed" and is_in_triangle((x, y), [(FLAGS.width, 0), (FLAGS.width, FLAGS.height),
                                                                  (x_center, y_center)]):
                action = 4  # Right
                text = "Right"
            elif category == "Open":
                action = 5  # Fire
                text = "Fire"
            else:
                action = 0
                text = "Stay"
            with lock:
                v.value = action
            cv2.putText(frame, "{}".format(text), (x_min, y_min - 5),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, GREEN, 2)

        overlay = frame.copy()
        cv2.drawContours(overlay, [np.array([(0, 0), (FLAGS.width, 0), (x_center, y_center)])], 0,
                         CYAN, -1)
        cv2.drawContours(overlay, [
            np.array([(0, FLAGS.height), (FLAGS.width, FLAGS.height), (x_center, y_center)])], 0,
                         CYAN, -1)
        cv2.drawContours(overlay, [
            np.array([(0, 0), (0, FLAGS.height), (x_center, y_center)])], 0,
                         YELLOW, -1)
        cv2.drawContours(overlay, [np.array([(FLAGS.width, 0), (FLAGS.width, FLAGS.height), (x_center, y_center)])], 0,
                         YELLOW, -1)
        cv2.circle(overlay, (x_center, y_center), radius, BLUE, -1)
        cv2.addWeighted(overlay, FLAGS.alpha, frame, 1 - FLAGS.alpha, 0, frame)

        cv2.imshow('Detection', frame)

    cap.release()
    cv2.destroyAllWindows()


if __name__ == '__main__':
    main()