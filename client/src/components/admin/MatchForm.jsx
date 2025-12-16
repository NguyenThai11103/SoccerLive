import { useState, useEffect } from "react";

function MatchForm({ match, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    homeTeam: "",
    awayTeam: "",
    league: "",
    startTime: "",
    streamUrl: "",
    streamKey: "",
    status: "SCHEDULED",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (match) {
      // Edit mode - populate form with match data
      const startTime = match.startTime
        ? new Date(match.startTime).toISOString().slice(0, 16)
        : "";
      setFormData({
        homeTeam: match.homeTeam || "",
        awayTeam: match.awayTeam || "",
        league: match.league || "",
        startTime,
        streamUrl: match.streamUrl || "",
        streamKey: match.streamKey || "",
        status: match.status || "SCHEDULED",
      });
    }
  }, [match]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.homeTeam.trim()) {
      newErrors.homeTeam = "Vui lòng nhập tên đội nhà";
    }
    if (!formData.awayTeam.trim()) {
      newErrors.awayTeam = "Vui lòng nhập tên đội khách";
    }
    if (!formData.league.trim()) {
      newErrors.league = "Vui lòng nhập giải đấu";
    }
    if (!formData.startTime) {
      newErrors.startTime = "Vui lòng chọn thời gian";
    }
    if (!formData.streamUrl.trim()) {
      newErrors.streamUrl = "Vui lòng nhập URL stream";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Convert startTime to ISO string
    const submitData = {
      ...formData,
      startTime: new Date(formData.startTime).toISOString(),
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Home Team */}
        <div>
          <label className="block text-sm font-medium text-dark-200 mb-2">
            Đội nhà <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="homeTeam"
            value={formData.homeTeam}
            onChange={handleChange}
            className={`input ${errors.homeTeam ? "border-red-500" : ""}`}
            placeholder="VD: Manchester United"
          />
          {errors.homeTeam && (
            <p className="text-red-500 text-sm mt-1">{errors.homeTeam}</p>
          )}
        </div>

        {/* Away Team */}
        <div>
          <label className="block text-sm font-medium text-dark-200 mb-2">
            Đội khách <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="awayTeam"
            value={formData.awayTeam}
            onChange={handleChange}
            className={`input ${errors.awayTeam ? "border-red-500" : ""}`}
            placeholder="VD: Liverpool"
          />
          {errors.awayTeam && (
            <p className="text-red-500 text-sm mt-1">{errors.awayTeam}</p>
          )}
        </div>
      </div>

      {/* League */}
      <div>
        <label className="block text-sm font-medium text-dark-200 mb-2">
          Giải đấu <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="league"
          value={formData.league}
          onChange={handleChange}
          className={`input ${errors.league ? "border-red-500" : ""}`}
          placeholder="VD: Premier League"
        />
        {errors.league && (
          <p className="text-red-500 text-sm mt-1">{errors.league}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Start Time */}
        <div>
          <label className="block text-sm font-medium text-dark-200 mb-2">
            Thời gian <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className={`input ${errors.startTime ? "border-red-500" : ""}`}
          />
          {errors.startTime && (
            <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-dark-200 mb-2">
            Trạng thái
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="input"
          >
            <option value="SCHEDULED">Sắp diễn ra</option>
            <option value="LIVE">Đang live</option>
            <option value="FINISHED">Đã kết thúc</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Stream URL */}
      <div>
        <label className="block text-sm font-medium text-dark-200 mb-2">
          URL Stream <span className="text-red-500">*</span>
        </label>
        <input
          type="url"
          name="streamUrl"
          value={formData.streamUrl}
          onChange={handleChange}
          className={`input ${errors.streamUrl ? "border-red-500" : ""}`}
          placeholder="https://..."
        />
        {errors.streamUrl && (
          <p className="text-red-500 text-sm mt-1">{errors.streamUrl}</p>
        )}
      </div>

      {/* Stream Key */}
      <div>
        <label className="block text-sm font-medium text-dark-200 mb-2">
          Stream Key
        </label>
        <input
          type="text"
          name="streamKey"
          value={formData.streamKey}
          onChange={handleChange}
          className="input"
          placeholder="Tùy chọn"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn bg-dark-700 hover:bg-dark-600"
        >
          Hủy
        </button>
        <button type="submit" className="btn btn-primary">
          {match ? "Cập nhật" : "Tạo trận đấu"}
        </button>
      </div>
    </form>
  );
}

export default MatchForm;
