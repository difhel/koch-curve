#include <emscripten/emscripten.h>
#include <vector>
#include <cmath>
#include <random>

struct Point {
    float x;
    float y;
};

extern "C" {

EMSCRIPTEN_KEEPALIVE
Point* generateKochCurve(int k, float startX, float startY, float endX, float endY, int* length) {
    std::vector<Point> curve = { {startX, startY}, {endX, endY} };

    float angle = - M_PI / 3;

    for (int i = 0; i < k; i++) {
        std::vector<Point> newCurve;
        for (size_t j = 0; j < curve.size() - 1; j++) {
            Point p1 = curve[j];
            Point p2 = curve[j + 1];

            // Calculate the 1/3 and 2/3 points
            Point s = { (2 * p1.x + p2.x) / 3, (2 * p1.y + p2.y) / 3 };
            Point t = { (p1.x + 2 * p2.x) / 3, (p1.y + 2 * p2.y) / 3 };

            // Calculate the peak point forming an equilateral triangle
            float dx = t.x - s.x;
            float dy = t.y - s.y;
            Point peak = { s.x + dx * cos(angle) - dy * sin(angle),
                           s.y + dx * sin(angle) + dy * cos(angle) };

            newCurve.push_back(p1);
            newCurve.push_back(s);
            newCurve.push_back(peak);
            newCurve.push_back(t);
        }
        newCurve.push_back(curve.back());
        curve = newCurve;
    }
    *length = curve.size();
    
    auto result = static_cast<Point*>(malloc(curve.size() * sizeof(Point)));
    memcpy(result, curve.data(), curve.size() * sizeof(Point));
    return result;
}

}
