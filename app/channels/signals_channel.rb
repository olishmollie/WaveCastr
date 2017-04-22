class SignalsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "signals_#{params[:lobby]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def offer(sdp)
    ActionCable.server.broadcast("signals_#{params[:lobby]}", sdp)
  end
end
